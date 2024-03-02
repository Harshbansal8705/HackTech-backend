import pandas as pd;
df = pd.read_csv('merged_data.csv')

def match_courses_with_preferences(preferences, roll_no, df):
    # Replace NaN values in 'Keywords' column with empty strings
    df['Keywords'] = df['Keywords'].fillna('')

    if preferences:
        # Filter courses based on matching keywords
        matched_courses = df[df['Keywords'].str.contains(preferences, case=False)]
    else:
        # Extract the third and fourth letters from the roll number
        code = roll_no[2:4]
        # Filter courses based on matching the extracted code with the course code
        matched_courses = df[df['Course code'].str.startswith(code)]

    # Sort courses based on the number of matched keywords
    matched_courses['Matched Keywords'] = matched_courses['Keywords'].apply(
        lambda x: sum(1 for word in x.split() if word.lower() in preferences.lower()))
    
    # Sort matched courses based on the number of matched keywords
    matched_courses = matched_courses.sort_values(by='Matched Keywords', ascending=False)

    # Return course codes of matched courses
    return matched_courses['Course code'].tolist()

# Example usage
preferences = ''  # Set preferences here
roll_no = '22CY10043'  # Set roll number here
course_codes = match_courses_with_preferences(preferences, roll_no, df)
print(course_codes)
