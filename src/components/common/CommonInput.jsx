export default function CommonInput({ id, children, ...otherProps }) {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input type="text" placeholder="" id={id} {...otherProps} />
    </>
  );
}
