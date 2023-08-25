import { ProjectInterface } from '@/common.type';
import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getProjectDetails } from '@/lib/actions';
import Modal from '@/components/Modal';
import ProjectForm from '@/components/ProjectForm';

export default async function EditProject({ params: { id }}: { params: { id: string }}) {
  const session = await getCurrentUser();
  const result = await getProjectDetails(id) as { project?: ProjectInterface };

  if(!session?.user) {
    redirect('/')
  }

  return (
    <Modal>
      <h3 className='modal-head-text'>Edit Project</h3>
      <ProjectForm
        type='edit'
        session={session}
        project={result?.project}
      />
    </Modal>
  )
};
