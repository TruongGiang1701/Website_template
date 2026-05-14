import { Container } from "@/components/shared/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

type DocsPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function DocsSlugPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const path = slug?.length ? slug.join("/") : "index";

  return (
    <Container className="max-w-3xl space-y-2">
      <Heading as="h1">Tài liệu</Heading>
      <Text muted size="sm">
        Đường dẫn: /docs/{path}
      </Text>
    </Container>
  );
}
