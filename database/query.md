# Installing chaincode

```sh
export CONTRACT_ID=degree-course

peer chaincode install -n $CONTRACT_ID -v 0.9 -l node -p /opt/gopath/src/chaincode/$CONTRACT_ID 
```


# Instantiating or Upgrading chaincode

```sh
peer chaincode instantiate -n $CONTRACT_ID -v 0.9 -l node -c '{"Args":[]}' -C myc -o orderer:7050

peer chaincode upgrade -n $CONTRACT_ID -v 1.0 -l node -c '{"Args":[]}' -C myc -o orderer:7050
```


# School

## createSchool

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["createSchool","{\"name\":\"Hust\",\"email\":\"hust.edu.vn\",\"password\":\"123\",\"admin_name\":\"Duong Trung Nghia\",\"address\":\"So 1, Dai co viet, Hai Ba Trung, Ha Noi, VN\"}"]}' -C myc -o orderer:7050
```

## getSchool

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getSchool", "{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\"}"]}' -C myc -o orderer:7050
```

## getSchoolByEmailPassword

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getSchoolByEmailPassword","{\"email\":\"hust.edu.vn\",\"password\":\"123\"}"]}' -C myc -o orderer:7050
```

# Issuer

## create Issuer

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["createIssuer","{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\",\"name\":\"The second issuer\",\"email\":\"issuer2.hust.edu.vn\",\"password\":\"123\",\"phone\":\"0931913131\",\"address\":\"The second issuer address\"}"]}' -C myc -o orderer:7050
``` 

## getIssuer

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getIssuer", "{\"issuer_id\":\"9c7ad6ba-972e-4958-a261-da053e1db487\"}"]}' -C myc -o orderer:7050
```

## getIssuerByEmailPassword

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getIssuerByEmailPassword","{\"email\":\"issuer2.hust.edu.vn\",\"password\":\"123\"}"]}' -C myc -o orderer:7050
```

## getIssuerBySchool

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getIssuerBySchool","{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\",\"page_size\":\"1\",\"bookmark\":\"\"}"]}' -C myc -o orderer:7050

peer chaincode query -n $CONTRACT_ID -c '{"Args":["getIssuerBySchool","{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\"}"]}' -C myc -o orderer:7050

```

# Course

## createCourse

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["createCourse", "{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\",\"course_code\":\"IT4005\",\"course_name\":\"Khai pha Web\",\"num_credits\":3,\"institute\":\"CNTT&TT\"}"]}' -C myc -o orderer:7050
``` 

## getCourse

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getCourse", "{\"course_id\":\"88f075ad-e204-49aa-911b-e689ef9f3e02\"}"]}' -C myc -o orderer:7050
```

## updateCourse

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["updateCourse", "{\"id\":\"88f075ad-e204-49aa-911b-e689ef9f3e02\",\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\",\"course_code\":\"IT4002\",\"course_name\":\"Tinh toan phan tan\",\"num_credits\":3,\"institute\":\"CNTT&TT\"}"]}' -C myc -o orderer:7050
```

## getCourseBySchool

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getCourseBySchool","{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\",\"page_size\":\"3\",\"bookmark\":\"\"}"]}' -C myc -o orderer:7050

peer chaincode query -n $CONTRACT_ID -c '{"Args":["getCourseBySchool","{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\"}"]}' -C myc -o orderer:7050
```

# Student

## createStudent

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["createStudent", "{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\",\"student_code\":\"20143158\",\"name\":\"Duong Trung Nghia\",\"class\":\"CNTT2.02\",\"school_year\":\"59\",\"email\":\"nghiadt143158@student.hust.edu.vn\",\"citizen_id\":\"011433113\",\"sex\":\"1\",\"address\":\"Phu Minh, Phu Xuyen, Ha Noi\",\"phone\":\"0931419141\"}"]}' -C myc -o orderer:7050
``` 

## getStudent

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getStudent", "{\"student_id\":\"a30db583-0fc4-4744-943f-6cd9f30a7758\"}"]}' -C myc -o orderer:7050
```

## updateStudent

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["updateStudent", "{\"id\":\"a30db583-0fc4-4744-943f-6cd9f30a7758\"}"]}' -C myc -o orderer:7050
```

## getStudentBySchool

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getStudentBySchool","{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\",\"page_size\":\"3\",\"bookmark\":\"\"}"]}' -C myc -o orderer:7050
```

# Student-course

## createStudentCourse

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["createStudentCourse", "{\"course_id\":\"88f075ad-e204-49aa-911b-e689ef9f3e02\",\"student_id\":\"a30db583-0fc4-4744-943f-6cd9f30a7758\",\"mid_term\":\"8.5\",\"last_term\":\"9.0\",\"weight\":\"0.7\",\"total_score_in_word\":\"A\"}"]}' -C myc -o orderer:7050
``` 

## getStudentCourse

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getStudentCourse", "{\"student_course_id\":\"8594adfc-3a4b-4730-b8c4-0f4769ebbe97\"}"]}' -C myc -o orderer:7050
```

## updateStudentCourse

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["updateStudentCourse", "{\"id\":\"8594adfc-3a4b-4730-b8c4-0f4769ebbe97\",\"course_id\":\"88f075ad-e204-49aa-911b-e689ef9f3e02\",\"student_id\":\"a30db583-0fc4-4744-943f-6cd9f30a7758\",\"mid_term\":\"8.5\",\"last_term\":\"9.5\",\"weight\":\"0.7\",\"total_score_in_word\":\"A\"}"]}' -C myc -o orderer:7050
```

## getStudentCourseByStudent

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getStudentCourseByStudent","{\"student_id\":\"a30db583-0fc4-4744-943f-6cd9f30a7758\",\"page_size\":\"3\",\"bookmark\":\"\"}"]}' -C myc -o orderer:7050
```

# Degree

## createDegree

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["createDegree", "{\"school_id\":\"5a68049c-c8a7-4591-a615-dbe3641c46aa\",\"name\":\"Ki su he thong thong tin\",\"institute\":\"CNTT&TT\"}"]}' -C myc -o orderer:7050
``` 

## getDegree

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getDegree", "{\"degree_id\":\"ef9bc191-376b-4bd0-b123-c2bbb2e60038\"}"]}' -C myc -o orderer:7050
```

## updateDegree

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["updateDegree", "{\"id\":\"ef9bc191-376b-4bd0-b123-c2bbb2e60038\",\"name\":\"Ky su he thong thong tin\",\"institute\":\"CNTT&TT\"}"]}' -C myc -o orderer:7050
```


# Degree-course

## createDegreeCourse

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["createDegreeCourse", "{\"course_id\":\"88f075ad-e204-49aa-911b-e689ef9f3e02\",\"degree_id\":\"ef9bc191-376b-4bd0-b123-c2bbb2e60038\"}"]}' -C myc -o orderer:7050
``` 

## getDegreeCourse

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getDegreeCourse", "{\"degree_course_id\":\"52ff0b17-4c39-452e-96c3-e7b57de5fc3b\"}"]}' -C myc -o orderer:7050
```

## updateDegreeCourse

```sh
peer chaincode invoke -n $CONTRACT_ID -c '{"Args":["updateDegreeCourse", "{\"id\":\"52ff0b17-4c39-452e-96c3-e7b57de5fc3b\",\"course_id\":\"88f075ad-e204-49aa-911b-e689ef9f3e02\",\"degree_id\":\"a30db583-0fc4-4744-943f-6cd9f30a7758\"}"]}' -C myc -o orderer:7050
```

## getDegreeCourseByDegree

```sh
peer chaincode query -n $CONTRACT_ID -c '{"Args":["getDegreeCourseByDegree","{\"degree_id\":\"ef9bc191-376b-4bd0-b123-c2bbb2e60038\",\"page_size\":\"3\",\"bookmark\":\"\"}"]}' -C myc -o orderer:7050
```
