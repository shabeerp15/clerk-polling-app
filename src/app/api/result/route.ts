import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
   host: 'localhost',
   user: 'root',
   password: 'root123',
   database: 'clerk_polls',
};

export async function POST(req: Request) {
   const requestBody = await req.json();

   const pool = mysql.createPool(dbConfig);
   const connection = await pool.getConnection();
   await connection.beginTransaction();

   try {
      const optionQuery = `SELECT id FROM poll_option WHERE value = ? AND q_id = ?`;
      const [optionID] = await connection.execute(optionQuery, [requestBody.selectedOption, requestBody.questionId]);
      const insertResultQuery = `INSERT INTO poll_result (option_id, q_id, username) VALUES (${(optionID as any)[0].id}, ${requestBody.questionId}, '${requestBody.username}')
                                     ON DUPLICATE KEY UPDATE q_id = VALUES(q_id), option_id = VALUES(option_id), username = VALUES(username)`;
      await connection.execute(insertResultQuery);

      await connection.commit();
      connection.release();

      return NextResponse.json({ error: false, message: 'Result updated' });
   } catch (error) {
      await connection.rollback();
      connection.release();
      return NextResponse.json({ error: true, message: 'Poll creation failed', data: error });
   }
}
