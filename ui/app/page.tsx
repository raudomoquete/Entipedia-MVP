import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Bienvenido a Entipedia
            </h1>
            <p className="text-xl text-muted-foreground">
              Tu plataforma de conocimiento empresarial
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="primary" size="lg">
              Comenzar
            </Button>
            <Button variant="outline" size="lg">
              Más información
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
