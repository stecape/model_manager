import { FC } from "react";
import { Typography } from "react-md";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@react-md/table';

import styles from './types.scss';

const Types: FC = () => (
  <>
    <Typography type="headline-4">Types</Typography>
    <Table className={styles.centered}>
      <TableHeader>
        <TableRow>
          <TableCell>Column 1</TableCell>
          <TableCell>Column 2</TableCell>
          <TableCell>Column 3</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Cell 1-1</TableCell>
          <TableCell>Cell 1-2</TableCell>
          <TableCell>Cell 1-3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cell 2-1</TableCell>
          <TableCell>Cell 2-2</TableCell>
          <TableCell>Cell 2-3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Cell 3-1</TableCell>
          <TableCell>Cell 3-2</TableCell>
          <TableCell>Cell 3-3</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </>
)
export default Types;