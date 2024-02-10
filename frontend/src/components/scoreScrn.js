import React, { useEffect, useState } from "react";

const Record = (props) => (
	<tr>
		<td>{props.record.name}</td>
		<td>{props.record.timeTaken}</td>
		<td>{props.record.guesses}</td>
		<td>{props.record.guessRange[0]} - {props.record.guessRange[1]}</td>
		<td>
			{/* <Link className="btn btn-link" to={`/edit/${props.record._id}`}>Edit</Link> | */}
			<button className="btn btn-link"
				onClick={() => {
					props.deleteRecord(props.record._id);
				}}
			>
				Delete
			</button>
		</td>
	</tr>
);

export default function ScoreTable() {
	const [records, setRecords] = useState([]);


	// This method fetches the records from the database.
	useEffect(() => {
		async function getRecords() {
			const response = await fetch(`http://localhost:5000/scores/`);
			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}
			const records = await response.json();
			setRecords(records);
		}
		getRecords().catch(() => alert("in catch"));
	}, [records.length]);

	// This method will delete a record
	async function deleteRecord(id) {
		await fetch(`http://localhost:5000/${id}`, {
			method: "DELETE"
		});
		const newRecords = records.filter((el) => el._id !== id);
		setRecords(newRecords);
	}

	// This method will map out the records on the table
	function recordList() {

		return records.map((record) => {
			return (
				<Record
					record={record}
					deleteRecord={() => deleteRecord(record._id)}
					key={record._id}
				/>
			);
		});
	}

	const HandleSort = (comparison) => {
		// Create a new sorted array instead of sorting in place
		const sortedRecords = [...records].sort(comparison);
		setRecords(sortedRecords);
	}

	// This following section will display the table with the records of individuals.
	return (
		<div>
			<h3>Record List</h3>
			<table>
				<thead>
					<tr>
						<th onClick={() => HandleSort((a, b) => a.name.localeCompare(b.name))}>Name</th>
						<th onClick={() => HandleSort((a, b) => a.timeTaken - b.timeTaken)}>Time</th>
						<th onClick={() => HandleSort((a, b) => a.guesses - b.guesses)}>Guesses</th>
						<th onClick={() => HandleSort((a, b) => a.guessRange[1] - b.guessRange[1])}>Range</th>
					</tr>
				</thead>
				<tbody>{recordList()}</tbody>
			</table>
		</div>
	);
}