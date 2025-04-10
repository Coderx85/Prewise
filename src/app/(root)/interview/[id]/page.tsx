import Image from 'next/image';
import { redirect } from 'next/navigation';
import Agent from '@/components/Agent';
import { getRandomInterviewCover } from '@/lib';
import { getFeedbackByInterviewId, getInterviewById } from '@/actions';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { RouteParams } from '@/types';
import { currentUser } from '@clerk/nextjs/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview with AI',
  description: 'Interview details and feedback',
};

const InterviewDetails = async ({ params }: RouteParams) => {
  const user = await currentUser();
  const { id } = await params;

  if (!id) {
    redirect('/');
  }

  try {
    const interview = await getInterviewById(id);
    if (!interview) redirect('/');

    const feedback = await getFeedbackByInterviewId({
      interviewId: id,
      userId: user?.id!,
    });

    return (
      <>
        <div className="flex flex-row gap-4 justify-between">
          <div className="flex flex-row gap-4 items-center max-sm:flex-col">
            <div className="flex flex-row gap-4 items-center">
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                width={40}
                height={40}
                className="rounded-full object-cover size-[40px]"
              />
              <h3 className="capitalize">{interview.role} Interview</h3>
            </div>

            <DisplayTechIcons techStack={interview.techstack} />
          </div>

          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
            {interview.type}
          </p>
        </div>

        <Agent
          userName={user?.fullName!}
          userId={user?.id}
          interviewId={id}
          type="interview"
          questions={interview.questions}
          feedbackId={feedback?.id}
        />
      </>
    );
  } catch (error) {
    console.error('Error fetching interview details:', error);
    redirect('/error');
  }
};
export default InterviewDetails;
