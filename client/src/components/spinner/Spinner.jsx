import style from "./Spinner.module.css";

function Spiner() {
  return ( 
    <div className={style.container}>
      <p className={style.spinner} />
    </div>
  );
}

export default Spiner;