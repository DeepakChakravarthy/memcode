import knex from '~/db/knex';
import initialScore from '~/models/ProblemUserIsLearningModel/services/initialScore';

const createPuil = async (problemId, userId, { ifIgnored }) => {
  const problem = (await knex('problem').where({ id: problemId }))[0];
  const courseUserIsLearningId = (await knex('courseUserIsLearning')
    .where({ courseId: problem.courseId, userId })
  )[0].id;

  const createdPuil = (await knex('problemUserIsLearning')
    .insert({
      easiness: initialScore().easiness,
      consecutiveCorrectAnswers: initialScore().consecutiveCorrectAnswers,
      ifIgnored,
      // Should be equivalent to timezone('UTC', now()), ###check
      next_due_date: knex.fn.now(),
      courseUserIsLearningId,
      problemId,
    })
    .returning('*')
  )[0];

  return createdPuil;
};

export default createPuil;