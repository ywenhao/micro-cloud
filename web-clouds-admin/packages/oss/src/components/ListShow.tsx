export const listShow = (data: string[]) => {
  return (
    <div class="flex flex-col items-start gap-y-1">
      {data.map(item => item)}
    </div>
  )
}
