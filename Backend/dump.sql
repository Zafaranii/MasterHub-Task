PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE quiz_sessions (
	id INTEGER NOT NULL, 
	quiz_id INTEGER NOT NULL, 
	student_id INTEGER NOT NULL, 
	start_time DATETIME NOT NULL, 
	score INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(quiz_id) REFERENCES quiz (id), 
	FOREIGN KEY(student_id) REFERENCES users (id)
);
INSERT INTO quiz_sessions VALUES(1,1,2,'2025-07-17 21:02:25.742829',0);
CREATE TABLE answers (
	id INTEGER NOT NULL, 
	submission_id INTEGER NOT NULL, 
	question_id INTEGER NOT NULL, 
	submitted_answer TEXT NOT NULL, 
	created_at DATETIME NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(submission_id) REFERENCES quiz_sessions (id), 
	FOREIGN KEY(question_id) REFERENCES questions (id)
);
INSERT INTO answers VALUES(1,1,1,'true','2025-07-17 16:19:56.689628');
INSERT INTO answers VALUES(2,2,1,'true','2025-07-17 16:37:01.324550');
INSERT INTO answers VALUES(3,3,1,'false','2025-07-17 16:37:27.739015');
INSERT INTO answers VALUES(4,4,1,'false','2025-07-17 16:45:08.498277');
INSERT INTO answers VALUES(5,5,1,'true','2025-07-17 16:45:16.402186');
INSERT INTO answers VALUES(6,2,1,'a','2025-07-17 17:54:30.698512');
INSERT INTO answers VALUES(7,2,2,'a','2025-07-17 17:54:30.702555');
INSERT INTO answers VALUES(8,3,1,'a','2025-07-17 17:54:37.710150');
INSERT INTO answers VALUES(9,3,2,'b','2025-07-17 17:54:37.712821');
INSERT INTO answers VALUES(10,1,1,'a','2025-07-17 20:59:44.895058');
INSERT INTO answers VALUES(11,1,2,'b','2025-07-17 20:59:44.898197');
INSERT INTO answers VALUES(12,1,1,'b','2025-07-17 21:02:25.743896');
INSERT INTO answers VALUES(13,1,2,'b','2025-07-17 21:02:25.747008');
CREATE TABLE questions (
	id INTEGER NOT NULL, 
	quiz_id INTEGER NOT NULL, 
	question VARCHAR NOT NULL, 
	type VARCHAR(12) NOT NULL, 
	options JSON, 
	true_false_answer BOOLEAN, 
	correct_answer VARCHAR, 
	points INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(quiz_id) REFERENCES quiz (id)
);
INSERT INTO questions VALUES(1,1,'hala wala','MCQ','["a", "b"]',NULL,'a',1);
INSERT INTO questions VALUES(2,1,'hala wala','MCQ','["a", "b"]',NULL,'a',1);
CREATE TABLE users (
	id INTEGER NOT NULL, 
	username VARCHAR NOT NULL, 
	email VARCHAR, 
	hashed_password VARCHAR NOT NULL, 
	is_teacher BOOLEAN, 
	full_name VARCHAR NOT NULL, 
	grade INTEGER, 
	PRIMARY KEY (id)
);
INSERT INTO users VALUES(1,'u','u@ah.com','$2b$12$j4B6WZSGKheXTVG.MpllR.E/baZm3LWjIfwQwJ3JnNsRCxkbtMeNe',1,'mawran',NULL);
INSERT INTO users VALUES(2,'uu','as@gmail.com','$2b$12$HPBo9BVo6n3FpYFBdeXmMOQUr2QAaweOUFig2/2s2xwnqe8q5o/Na',0,'as',4);
CREATE TABLE quiz (
	id INTEGER NOT NULL, 
	title VARCHAR NOT NULL, 
	created_at DATETIME, 
	duration INTEGER, 
	user_id INTEGER, 
	start_time DATETIME, 
	end_time DATETIME, 
	grade INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES users (id), 
	FOREIGN KEY(grade) REFERENCES users (grade)
);
INSERT INTO quiz VALUES(1,'quiz 1 ','2025-07-17 20:26:54.735750',10,1,NULL,NULL,4);
INSERT INTO quiz VALUES(2,'quiz 2','2025-07-17 21:49:34.143001',10,1,NULL,NULL,NULL);
CREATE INDEX ix_quiz_sessions_id ON quiz_sessions (id);
COMMIT;
