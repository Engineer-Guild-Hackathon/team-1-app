'use server';

import { Course } from '@prisma/client';
import { prisma } from '../../../lib/prisma';

export type TCourse = Course;

export async function fetchCourses(): Promise<{ result: boolean; data: TCourse[] }> {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'asc' as 'asc' },
  });
  return {
    result: true,
    data: courses,
  };
}
