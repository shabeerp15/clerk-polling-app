import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
   host: 'localhost',
   user: 'root',
   password: 'root123',
   database: 'clerk_polls',
};

export const GET = async (req: Request, res: Response) => {
   const id = req.url.split('result/')[1];

   const pool = mysql.createPool(dbConfig);
   const connection = await pool.getConnection();
   await connection.beginTransaction();

   try {
      const fetchPollResultQuery = `SELECT 
                                        pq.id,
                                        pq.question,
                                        JSON_ARRAYAGG(
                                            JSON_OBJECT(
                                            'option', po.value,
                                            'result', (select count(*) from poll_result where q_id = pq.id and option_id = po.id )
                                            )
                                        ) AS options,
                                        (SELECT COUNT(*) FROM poll_result WHERE q_id = pq.id) AS total_polls
                                    FROM poll_question AS pq
                                    JOIN poll_option AS po ON pq.id = po.q_id
                                    WHERE pq.id = ${id}
                                    GROUP BY pq.id, pq.question;`;
      const [pollResult] = await connection.execute(fetchPollResultQuery);

      await connection.commit();
      connection.release();

      return NextResponse.json({ error: false, message: 'Result fetched successfully', data: pollResult });
   } catch (error) {
      await connection.rollback();
      connection.release();
      return NextResponse.json({ error: true, message: 'Poll creation failed', data: error });
   }
};

export const POST = async (req: Request, res: Response) => {};
