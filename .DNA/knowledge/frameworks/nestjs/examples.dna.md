# Example

```ts
@UseGuards(AuthGuard)
@Post()
create(@Body() dto: CreateDto) { return this.svc.create(dto); }
```
