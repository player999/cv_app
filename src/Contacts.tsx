import { Card, CardMedia, Grid, Link, Typography } from "@mui/material";
import * as React from "react";
import { FC, useState } from "react";
import { AsyncProps, useAsync } from "react-async";

function createCard(type_of_card: string, data: any): JSX.Element {
    return (
        <Grid item xs={4}>
            <Card>
                <CardMedia
                    component="img"
                    height="140"
                    image={"static_data/contacts/" + data.pic }
                    sx={{objectFit: "contain"}}
                />
                {data.link && <Link textAlign={"center"} href={data.link}><Typography textAlign={"center"}>{data.text}</Typography></Link>}
                {(data.text) && (!data.link) && <Typography textAlign={"center"}>{data.text}</Typography>}
            </Card>
        </Grid>
    );
}

const getContactsInfo = async (
    props: AsyncProps<string>,
    controller: AbortController
): Promise<string> => {
    const response = fetch("static_data/contacts/contacts.json").then((value: Response) => {
        return value.text().then((value: string) => {
            return value;
        })
    });
    return response;
};

export const Contacts: FC = () => {
    const [get_contact_list, set_contact_list] = useState<Array<JSX.Element>>([]);
    useAsync({ promiseFn: getContactsInfo, onResolve: (data: string) => {
        let contacts: any;
        if( typeof data == "string" ) {
            contacts = JSON.parse(data);
        }

        const contact_list = Object.entries(contacts).map((value: [string, unknown]) => {
            return createCard(value[0], value[1]);
        });
        set_contact_list(contact_list);
    }});
    console.log(get_contact_list);
    return React.createElement(Grid, {container: true, spacing: 2, justifyContent: "center"}, get_contact_list);
}