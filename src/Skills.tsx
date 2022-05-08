import { Card, CardMedia, Grid, Rating, Stack, Typography } from "@mui/material";
import * as React from "react";
import { FC, useState } from "react";
import { AsyncProps, useAsync } from "react-async";

const getSkillsInfo = async (
    props: AsyncProps<string>,
    controller: AbortController
): Promise<string> => {
    const response = fetch("static_data/skills/skills.json").then((value: Response) => {
        return value.text().then((value: string) => {
            return value;
        })
    });
    return response;
};

enum CatType {
    CatQualitative = "qualitative",
    CatQuantitive = "quantitive"
};

function createQuantitiveCard(value: any): JSX.Element {
    return (
        <Grid item xs={4} p={2} >
            <Card>
                {value["pic"] && <CardMedia
                    component="img"
                    height="140"
                    image={"static_data/skills/"+value["pic"]}
                    sx={{objectFit: "contain"}}
                />}
                <Typography>{value["name"]}</Typography>
                { value["stars"] && value["stars_total"] && <Rating name="read-only" max={value["stars_total"]} value={value["stars"]} readOnly />}
            </Card>
        </Grid>);
}

function createQualitativeCard(value: any): JSX.Element {
    return (
        <Grid item xs={4} p={2} >
            <Card>
                {value["pic"] && <CardMedia
                    component="img"
                    height="140"
                    image={"static_data/skills/"+value["pic"]}
                    sx={{objectFit: "contain"}}
                />}
                <Typography>{value["name"]}</Typography>
            </Card>
        </Grid>);
}

function createCategory(cat: Array<any>, cat_type: CatType, cat_name: string): JSX.Element {
    console.log(cat_name)
    const cards = cat.map<JSX.Element>((value: any) => {
        if(CatType.CatQualitative == cat_type) {
            return createQualitativeCard(value);
        } else if(CatType.CatQuantitive == cat_type) {
            return createQuantitiveCard(value);
        } else {
            return <Typography>Unknown category: {cat_type}</Typography>
        }
    });
    return (
        <Stack
            direction="column"
            justifyContent="left"
            alignItems="left"
            spacing={2}
            width="100%"
        >
            <Typography variant="h4">{cat_name}</Typography>
            {React.createElement(Grid, {container: true, spacing: 2 }, cards)}
        </Stack>
    );
}

function parseQuantitive(data: any): Array<JSX.Element> {
    return Object.entries(data["skills"]).map<JSX.Element>(
        ([key, value]) => {
            const cats = createCategory(value as Array<any>, CatType.CatQuantitive, data["category_dictionary"][key]["name"]);
            return React.createElement(Stack,
                { direction: "column", justifyContent: "left", alignItems: "left", spacing: 2},
                cats);
        }
    );
}

function parseQualitative(data: any): Array<JSX.Element> {
    return Object.entries(data["skills"]).map<JSX.Element>(
        ([key, value]) => {
            const cats = createCategory(value as Array<any>, CatType.CatQualitative, data["category_dictionary"][key]["name"]);
            return React.createElement(Stack,
                { direction: "column", justifyContent: "left", alignItems: "left", spacing: 2},
                cats);
        }
    );
}

function parseSkillData(data: any): JSX.Element {

    const quantitive = data["quantitive"];
    const qualitative = data["qualitative"];

    const all_skills = parseQualitative(qualitative).concat(parseQuantitive(quantitive));
    return React.createElement(Stack,
        { direction: "column", justifyContent: "left", alignItems: "left", spacing: 2},
        all_skills);
}

export const Skills: FC = () => {
    const [get_skillz_form, set_skillse_form] = useState(<Typography align="center">Loading</Typography>)
    useAsync({ promiseFn: getSkillsInfo, onResolve: (data: string) => {
        let skills: any;
        if( typeof data == "string" ) {
            const skillzdata = JSON.parse(data);
            set_skillse_form(parseSkillData(skillzdata));
        }

    }});
    return (get_skillz_form);
}