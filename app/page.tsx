import { ProjectInterface } from '@/common.type';
import { fetchAllProjects } from '@/lib/actions';
import ProjectCard from '@/components/ProjectCard';
import Categories from '@/components/Categories';
import LoadMore from '@/components/LoadMore';

type ProjectsSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
};

type searchParams = {
  category?: string;
  endcursor?: string;
};

type Props = {
  searchParams: searchParams;
};

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default async function Home({ searchParams: {category, endcursor}}: Props) {
  const data = await fetchAllProjects(category, endcursor) as ProjectsSearch;
  const projectsToDisplay = data?.projectSearch?.edges || [];
  const pagination = data?.projectSearch?.pageInfo;

  if(projectsToDisplay.length === 0) {
    return (
      <section className='flexStart flex-col paddings'>
        <Categories />
        <p className='no-result-text text-center'>No projects found, go create some first.</p>
      </section>
    )
  }

  return (
    <section className='flexStart flex-col paddings mb-16'>
      <Categories />

      <section className='projects-grid'>
        {projectsToDisplay.map(({ node }: { node: ProjectInterface }) => (
          <ProjectCard
            key={node?.id}
            id={node?.id}
            image={node?.image}
            title={node?.title}
            name={node?.createdBy?.name}
            avatarUrl={node?.createdBy?.avatarUrl}
            userId={node?.createdBy?.id}
          />
        ))}
      </section>

      <LoadMore
        startCursor={pagination.startCursor}
        endCursor={pagination.endCursor}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
      />
    </section>
  );
};
