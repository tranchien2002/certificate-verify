# 1. Giới thiệu

    Project gồm 3 thành phần chính:

- certificate-network: Chứa cấu hình của mạng, chaincode,...
- academy-app: ứng dụng phía Academy Org
- student-app: ứng dụng phía Student Org

# 2. Chạy project

## Setup network và cài đặt chaicode

cd certificate-network/nework. Sau đó chạy tất cả câu lệnh trong file README.md trong cùng 1 terminal

## Phía Academy

cd acdemy-app. Thực hiện enroll admin. Sau đó register cho giảng viên tương ứng. Hướng dẫn có trong academy-app/README.md

Thực hiện các câu lệnh invoke, query như trong hướng dẫn.

## Phía Student

cd student-app. Thực hiện enroll admin. Sau đó register cho sinh viên tương ứng. Hướng dẫn có trong student-app/README.md

Thực hiện các câu lệnh query như trong hướng dẫn.

# 3. Chú ý

Ở thời điểm khởi tạo chaincode, vẫn chưa có gì được lưu trong chaincode.

Phía Academy có các quyền:
- Register giảng viên mới
- CreateSubject
- CreateScore, cho một student và một subject đã tồn tại trong ledger
- CreateCertificate: nếu một student đã hoàn thành tất cả các subject thì mới có thể  cấp certificate
- QuerySubject, Student, Score, Certificate
- GetAAllSubjects, Students, Scores, Certificate

Phía Student có các quyền:
- Register student mới
- QueryStudent, Score, Certificate của chính mình
- GetAllSubjects

(Các câu lệnh xem thêm trong README.md của từng thư mục)