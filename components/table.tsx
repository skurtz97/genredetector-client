

export interface TableProps<T> {
    columns: (keyof T)[]
    data: T[]

}

export function Table<T>({ columns, data }: TableProps<T>) {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <th key={i}>{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i}>
                        {columns.map((col, j) => (
                            <td key={j}>
                                {row[col]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}