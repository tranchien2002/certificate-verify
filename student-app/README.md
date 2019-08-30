# enroll Admin
node enrollAdmin.js

# enroll a new student
node registerUser.js --userid 20156425 --name "Trinh Van Tan"

# query Student
node query.js --userid 20156425 --f QueryStudent

# query Subject
node query.js --userid --f QuerySubject --subjectid 00

# query Score
node query.js --userid --f QueryScore --subjectid 00

# get all scores
node query.js --userid --f GetAllScores

# query Certificate
node query.js --userid --f QueryCertificate