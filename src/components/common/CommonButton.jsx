export default function CommonButton({ id, children, ...otherProps }) {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input id={id} {...otherProps} />
    </>
  );
}
