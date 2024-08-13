import { useSession } from '../../context/AuthCtx';
import { Stack, useRouter } from 'expo-router';
import Container from '../../components/Container';
import { Button, Card, Divider, Searchbar, Text, useTheme } from 'react-native-paper';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { formatDate } from '../../utils/helper';

type InvoiceItem = {
	itemid: number;
	itemcode: string;
	itemdesc: string;
	qnty: number;
};

type Invoice = {
	invoiceno: string;
	appuserid: string;
	appversion: string;
	plantcode: string;
	custcode: string;
	custname: string;
	invoicedate: string;
	invoicestatus: string;
	invoiceitemlist: InvoiceItem[];
};

function CardContent({ title, value }: { title: string; value: string }) {
	return (
		<Card.Content
			style={{
				marginTop: 15,
			}}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'baseline',
					gap: 10,
				}}>
				<Text
					variant="bodyLarge"
					style={{
						fontWeight: 800,
						fontStyle: 'italic',
					}}>
					{title}
				</Text>
				<Text>:</Text>
				<Text>{value}</Text>
			</View>
		</Card.Content>
	);
}

function InvoiceRow({ itemcode, itemdesc, qnty }: InvoiceItem) {
	const router = useRouter();
	return (
		<TouchableOpacity onPress={() => router.push(`/invoiceItemScan?partcode=${itemcode}&qty=${qnty}`)}>
			<View style={styles.invoiceRow}>
				<View>
					<Text>{itemcode}</Text>
					<Text>{itemdesc}</Text>
				</View>

				<View style={styles.qntyContainer}>
					<Text style={{ textAlign: 'center', fontStyle: 'italic', fontWeight: 800 }}>qty</Text>
					<Text style={{ textAlign: 'center', paddingBottom: 2 }}>{qnty}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export default function Index() {
	const { signOut, session } = useSession();

	const theme = useTheme();

	const username = 'miplapp';
	const password = 'App@1234';
	const credentials = btoa(`${username}:${password}`);

	const [page, setPage] = useState(0);
	const [numberOfItemsPerPageList] = useState([2, 3, 4]);
	const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
	const [tableData, setTableData] = useState<string[][]>();
	const [invoiceNum, setInvoiceNum] = useState('');
	const [invoiceData, setInvoiceData] = useState<Invoice>();

	const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>();

	const from = page * itemsPerPage;
	const to = useMemo(() => {
		if (invoiceItems) return Math.min((page + 1) * itemsPerPage, invoiceItems?.length);
	}, [invoiceItems?.length]);

	useEffect(() => {
		setPage(0);
	}, [itemsPerPage]);

	const searchInvoice = async (invoice: string) => {
		try {
			const res = await fetch(`http://10.255.38.8:8000/dispatchinquiry/dispatchinquiry?sap-client=600&VBELN=${invoice}8&WERKS=1001&APPUSERID=%27%27&APPVERSION=%27%27`, {
				headers: {
					Authorization: `Basic ${credentials}`,
					'Content-Type': 'application/json',
				},
			});

			const data = await res.json();
			setInvoiceData(data);
			const arraysOfValues = data.invoiceitemlist.map(Object.values);
			setTableData(arraysOfValues);
			setInvoiceItems(data.invoiceitemlist);
		} catch (err) {
			console.error('Something occurred while making api call');
		}
	};

	return (
		<Container>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			<Text
				style={{ color: theme.colors.primary, marginBottom: 25 }}
				variant="titleLarge">
				Search Invoices
			</Text>

			<Searchbar
				placeholder="Search"
				onChangeText={setInvoiceNum}
				elevation={2}
				onIconPress={async () => {
					if (invoiceNum !== '') {
						await searchInvoice(invoiceNum);
					}
				}}
				value={invoiceNum}
			/>

			{invoiceData && (
				<>
					<Card style={{ marginTop: 25, paddingBottom: 15 }}>
						<Card.Title
							title="Invoice details"
							titleStyle={{
								fontSize: 25,
								paddingTop: 18,
							}}
						/>

						<Divider
							theme={{
								colors: { primary: 'green' },
							}}
						/>

						<CardContent
							title="Invoice number"
							value={invoiceData?.invoiceno}
						/>
						<CardContent
							title="Invoice date"
							value={formatDate(invoiceData?.invoicedate)}
						/>
						<CardContent
							title="Invoice status"
							value={invoiceData?.invoicestatus}
						/>
						<CardContent
							title="Customer code"
							value={invoiceData?.custcode}
						/>
						<CardContent
							title="Customer name"
							value={invoiceData?.custname}
						/>
						<CardContent
							title="Plant code"
							value={invoiceData?.plantcode}
						/>
					</Card>

					<Card style={{ marginTop: 15, paddingBottom: 15 }}>
						<Card.Title
							title="Invoice items"
							titleStyle={{
								fontSize: 25,
								paddingTop: 18,
							}}
						/>
						<Divider
							theme={{
								colors: { primary: 'green' },
							}}
						/>
						<View style={styles.invoiceRowContainer}>
							{invoiceItems &&
								invoiceItems?.slice(from, to).map((item) => (
									<InvoiceRow
										key={item.itemid}
										itemcode={item.itemcode}
										itemdesc={item.itemdesc}
										itemid={item.itemid}
										qnty={item.qnty}
									/>
								))}
						</View>
					</Card>
				</>
			)}

			<Button
				mode="outlined"
				style={{ width: '100%', marginTop: 15, borderColor: theme.colors.primary, backgroundColor: theme.colors.primary }}
				onPress={signOut}>
				<Text style={{ color: '#FFF' }}>Log out</Text>
			</Button>
		</Container>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingTop: 100, paddingHorizontal: 30, backgroundColor: '#fff' },
	head: { height: 44 },
	row: { height: 70 },
	invoiceRowContainer: {},
	invoiceRow: {
		borderColor: '#fff',
		borderWidth: 1,
		margin: 10,
		padding: 5,
		borderRadius: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	qntyContainer: {
		borderColor: '#fff',
		borderWidth: 1,
		width: '15%',
		height: '90%',
		borderRadius: 20,
		padding: 2,
	},
});
