import HomePage from '@/features/home/page';
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/')({
  component: HomePage,
  loader: () => {
    return {
      crumb: "Home",
    };
  },
})