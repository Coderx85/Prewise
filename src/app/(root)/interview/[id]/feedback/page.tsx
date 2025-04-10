import dayjs from 'dayjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import { getFeedbackByInterviewId, getInterviewById } from '@/actions';
import { currentUser } from '@clerk/nextjs/server';
import { RouteParams } from '@/types';

const Feedback = async ({ params }: RouteParams) => {
  try {
    const { id } = await params;
    if (!id) {
      redirect('/');
    }

    const user = await currentUser();
    if (!user) {
      redirect('/sign-in');
    }

    const [interview, feedback] = await Promise.all([
      getInterviewById(id),
      getFeedbackByInterviewId({
        interviewId: id,
        userId: user.id,
      }),
    ]);

    if (!interview || !feedback) {
      redirect('/');
    }

    return (
      <section className="section-feedback">
        <div className="flex flex-row justify-center">
          <h1 className="text-4xl font-semibold">
            Feedback on the Interview -{' '}
            <span className="capitalize">{interview.role}</span> Interview
          </h1>
        </div>

        {/* Rest of your JSX remains the same */}
        <div className="flex flex-row justify-center">
          <div className="flex flex-row gap-5">
            {/* Overall Impression */}
            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>
                Overall Impression:{' '}
                <span className="text-primary-200 font-bold">
                  {feedback.totalScore}
                </span>
                /100
              </p>
            </div>

            {/* Date */}
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>
                {feedback.createdAt
                  ? dayjs(feedback.createdAt).format('MMM D, YYYY h:mm A')
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <hr />

        {/* Rest of your component remains the same */}
      </section>
    );
  } catch (error) {
    console.error('Error in feedback page:', error);
    redirect('/error');
  }
};

export default Feedback;
