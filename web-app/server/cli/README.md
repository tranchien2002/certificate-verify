## 1. Enroll admin

```bash
node enrollAdmin.js --orgid=[OrgName]
```

#### Example:

```bash
node enrollAdmin.js --orgid=academy
```

## 2. Register user

```bash
node registerUser.js --userid=[user-id] --orgid=[OrgName]
```

#### Example:

```bash
node registerUser.js --userid=user1 --orgid=academy
```

## Query Ledger

```bash
node query.js --userid=[UserId] --orgid=[OrgName] --func=[FunctionName] --args=[Argument]
```

#### Example:

```bash
node query.js --userid=admin --orgid=academy --func=QueryStudent --args=1
```

```bash
node query.js --userid=user1 --orgid=academy --func=GetAllStudents
```

```bash
// arguments = [StudentId, SubjectId]
node query.js --userid=admin --orgid=student --func=QueryScore --args=10 --args=160212
```

## Invoke Ledger

#### Example:

```bash
node invoke.js --userid=admin --func=CreateCertificate --studentid=1
```
