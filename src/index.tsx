import * as React from 'react';
import { hydrate } from 'react-dom';
import { AppBar, Avatar, Box, Stack, Typography, Button, Tab} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { FC, useState } from 'react';
import { Experience } from './Experience';
import { Contacts } from './Contacts';
import { Skills } from './Skills';
import { AsyncProps, useAsync } from 'react-async';

const getMainConfig = async (
  props: AsyncProps<string>,
  controller: AbortController
): Promise<string> => {
  const response = fetch("static_data/header.json").then((value: Response) => {
      return value.text().then((value: string) => {
          return value;
      })
  });
  return response;
};

const Header = (header_config: any) => (
  <Box width="100%">
  <AppBar sx={{ boxShadow: 0, padding: 2 }} position="static" >
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={5}
      width="100%"
    >
      <Avatar sx={{ width: 150, height: 150 }} src="static_data/ava.jpg"/>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Typography variant='h4'>Taras Zakharchenko</Typography>
        <Typography variant='h6'>Embedded software engineer</Typography>
      </Stack>
      <Button variant="contained" color="secondary" startIcon={<ArticleIcon />}>Get PDF</Button>
    </Stack>
  </AppBar>
  </Box>
)

export const App: FC = () => {
  const [get_selected_tab, set_selected_tab] = useState<string>("1");
  const [get_head, set_head] = useState<JSX.Element>(<Typography>Header</Typography>);
  useAsync({ promiseFn: getMainConfig, onResolve: (data: string) => {
      let head_config: any;
      if( typeof data == "string" ) {
        head_config = JSON.parse(data);
      }
      set_head(Header(head_config));
  }});
  return (
    <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
    >
      {get_head}
      <Box sx={{ width: '60%', minWidth: "600px" }}>
        <TabContext value={get_selected_tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList aria-label="Menu" centered>
              <Tab label="Experience" onClick={()=>{set_selected_tab("1")}} value="1" />
              <Tab label="Skills" onClick={()=>{set_selected_tab("2")}} value="2" />
              <Tab label="Contacts" onClick={()=>{set_selected_tab("3")}} value="3" />
            </TabList>
          </Box>
          <TabPanel value="1"><Experience/></TabPanel>
          <TabPanel value="2"><Skills/></TabPanel>
          <TabPanel value="3"><Contacts/></TabPanel>
        </TabContext>
      </Box>
    </Stack>
  );
}

hydrate(<App />, document.querySelector('#app'));
