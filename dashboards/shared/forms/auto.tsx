import { UpdateFunction } from "dashboards/types";

export function autoGenerateController<T>(
  parameters: T,
  updateFunction: UpdateFunction<T>
) {
  if (typeof parameters === "string" || parameters === null) {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      updateFunction(event.target.value as unknown as T);
    };
    return (
      <input type="text" value={parameters as string} onChange={onChange} />
    );
  } else if (typeof parameters === "object") {
    return (
      <div>
        {Object.entries(parameters).map(([key, value]) => {
          const subUpdateFunction = (newValue: unknown) => {
            const newParameters: T = { ...parameters };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            newParameters[key] = newValue;
            updateFunction(newParameters);
          };
          return (
            <div key={key}>
              <h4 className="mb-2 block text-slate-900">{key}</h4>
              {autoGenerateController(value, subUpdateFunction)}
            </div>
          );
        })}
      </div>
    );
  } else return <div>Not implemented</div>;
}
