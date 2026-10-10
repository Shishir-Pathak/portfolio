import SectionTitle from '../components/SectionTitle.jsx';
import CourseCard from '../components/CourseCard.jsx';
import { courses } from '../data/courses.js';

export default function Courses() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-32">
      <SectionTitle title="Learn With" accent="Me" subtitle="Industry-focused courses taught through real projects." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => <CourseCard key={c.slug} c={c} i={i} />)}
      </div>
    </section>
  );
}
