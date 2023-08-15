import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';

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
      const insertQuestionQuery = 'INSERT INTO poll_question (username, question, expired_at) VALUES (?, ?, ?)';
      let dt = new Date(requestBody.expiryDate).toISOString().split('T');
      let mysqlTime = dt[0] + ' ' + dt[1].slice(0, 8);
      const questionValues = [requestBody.username, requestBody.question, mysqlTime];
      const [questionResults] = await connection.execute(insertQuestionQuery, questionValues);

      if (requestBody.options && Array.isArray(requestBody.options)) {
         const insertOptionQuery = 'INSERT INTO poll_option (q_id, value) VALUES (?, ?)';
         for (const option of requestBody.options) {
            const optionValues = [(questionResults as any).insertId, option];
            await connection.execute(insertOptionQuery, optionValues);
         }
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({ error: false, message: 'Poll created successfully' });
   } catch (error) {
      await connection.rollback();
      connection.release();
      return NextResponse.json({ error: true, message: 'Poll creation failed', data: error });
   }
}

export async function GET(req: Request) {
   const { userId } = getAuth(req as any);
   const pool = mysql.createPool(dbConfig);

   const connection = await pool.getConnection();
   await connection.beginTransaction();

   try {
      const fetchQuestionQuery = `SELECT
                                         pq.id,
                                         pq.question,
                                         JSON_ARRAYAGG(po.value) AS options,
                                         (select value from poll_option where id = (select option_id from poll_result where q_id = pq.id and username = '${userId}') ) as selected
                                     FROM poll_question AS pq
                                     JOIN poll_option AS po ON pq.id = po.q_id
                                     WHERE DATE(pq.expired_at) >= CURRENT_DATE
                                     GROUP BY pq.id, pq.question;`;
      const [questionResults] = await connection.execute(fetchQuestionQuery);

      await connection.commit();
      connection.release();

      return NextResponse.json({ error: false, message: 'Polls fetched successfully', data: questionResults });
   } catch (error) {
      await connection.rollback();
      connection.release();
      return NextResponse.json({ error: true, message: 'Polls fetching failed', data: error });
   }
}
