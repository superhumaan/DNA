# Examples

## Route Handler
```ts
export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  // …
  return Response.json({ ok: true });
}
```

## Server Component data
```tsx
export default async function Page() {
  const data = await getData();
  return <View data={data} />;
}
```
