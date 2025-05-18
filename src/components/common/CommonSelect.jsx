export default function CommonSelect({ id, children, options, ...otherProps }) {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <select id={id} {...otherProps}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </>
  );
}
