export default function Error({ msg }: { msg?: string }) {
  return <div>{msg ? msg : "Error"}</div>;
}
