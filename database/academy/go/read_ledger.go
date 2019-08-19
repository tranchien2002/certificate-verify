package main

import (
	"encoding/json"
	"errors"
//	"fmt"
//	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
//	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
)

func getStudent(stub shim.ChaincodeStubInterface, compoundKey string) (Student, error){
	var student Student

	studentAsBytes, err := stub.GetState(compoundKey)

	if err != nil {
		return student, errors.New("Failed to get student - " + compoundKey)
	}

	if studentAsBytes == nil{
		return student, errors.New("Student does not exist - " + compoundKey)
	}

	json.Unmarshal(studentAsBytes, &student)

	return student, nil
}

func getSubject(stub shim.ChaincodeStubInterface, compoundKey string) (Subject, error){
	var subject Subject

	subjectAsBytes, err := stub.GetState(compoundKey)

	if err != nil {
		return subject, errors.New("Failed to get subject - " + compoundKey)
	}

	if subjectAsBytes == nil {
		return subject, errors.New("Subject does not exist - " + compoundKey)
	}

	json.Unmarshal(subjectAsBytes, &subject)

	return subject, nil
}

func getScores(stub shim.ChaincodeStubInterface, compoundKey string) (Scores, error){
	var scores Scores

	scoresAsBytes, err := stub.GetState(compoundKey)

	if err != nil {
		return  scores, errors.New("Failed to get scores - " + compoundKey)
	}

	if scoresAsBytes == nil {
		return scores, errors.New("Scores does not exist - " + compoundKey)
	}

	json.Unmarshal(scoresAsBytes, &scores)

	return scores, nil
}

func getCertificate(stub shim.ChaincodeStubInterface, compoundKey string) (Certificate, error){
	var certificate Certificate

	certificateAsBytes, err := stub.GetState(compoundKey)

	if err != nil {
		return certificate, errors.New("Failed to get certificate - " + compoundKey)
	}

	if certificateAsBytes == nil {
		return certificate, errors.New("Certificate does not exist - " + compoundKey)
	}

	json.Unmarshal(certificateAsBytes, &certificate)

	return certificate, nil
}

func getListOfSubjects(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	/*
	start := []string{"00"}
	end := []string{"99"}

	startKey, _  := stub.CreateCompositeKey("Subject", start)
	endKey, _ := stub.CreateCompositeKey("Subject", end)
	//rs, err:= stub.GetStateByPartialCompositeKey("Subject", start)
	rs, err := stub.GetStateByRange(startKey, endKey) 
	

	if err != nil {
		return shim.Error("Failed")
	} */

	var tlist []Subject
	var i = 0
	for i = 0;i <= 9999999;i++ {
		var key []string
		if i <=9 {
			key = []string{"0"+string(i)}
		}else {
			key = []string{string(i)}
		}
		compositeKey, _ := stub.CreateCompositeKey("Subject", key)

		subjectAsBytes, err := stub.GetState(compositeKey)
		if err != nil {
			return shim.Success(nil)
		}
		if subjectAsBytes == nil {
			break
		}
		subject := Subject{}
		json.Unmarshal(subjectAsBytes, &subject)
		tlist = append(tlist, subject)
	}

	jsonRow, err := json.Marshal(tlist)
	if err != nil {
		return shim.Error("failed")
	}

	return shim.Success(jsonRow)
}

