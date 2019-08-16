package main

import (
	"encoding/json"
	"errors"
//	"fmt"
//	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
//	sc "github.com/hyperledger/fabric/protos/peer"
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

func getCertificate(stub shim.ChaincodeStubInterface, compoundKey string)(Certificate, error){
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