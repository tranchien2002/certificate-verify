# 1. Giới thiệu

    Project gồm 3 thành phần chính:

- certificate-network: Chứa cấu hình của mạng, chaincode,...
- academy-app: ứng dụng phía Academy Org
- student-app: ứng dụng phía Student Org

# 2. Chạy project

## Setup network và cài đặt chaicode

cd certificate-network/network

Làm theo hướng dẫn trong README.md

## Phía Academy

cd acdemy-app

Cài các package

Thực hiện enroll admin. Sau đó register cho giảng viên tương ứng.

Thực hiện các câu lệnh invoke, query.

( Tất cả hướng dẫn có trong academy-app/README.md )

## Phía Student

cd student-app

Cài các package

Thực hiện enroll admin. Sau đó register cho sinh viên tương ứng.

Thực hiện các câu lệnh query.

( Tất cả hướng dẫn có trong student-app/README.md )

# 3. Chú ý

Ở thời điểm khởi tạo chaincode, vẫn chưa có gì được lưu trong chaincode.

Phía Academy có các quyền:
- Register giảng viên mới
- CreateSubject, chỉ có admin mới có quyền này
- CreateScore, nếu một student và một subject đã tồn tại trong ledger
- CreateCertificate: nếu một student đã hoàn thành tất cả các subject thì mới có thể  cấp certificate
- QuerySubject, Student, Score, Certificate
- GetAllSubjects, Students, Scores, Certificates

Phía Student có các quyền:
- Register student mới
- QueryStudent, Score, Certificate của chính mình
- GetAllSubjects

(Các câu lệnh xem thêm trong README.md của từng thư mục)