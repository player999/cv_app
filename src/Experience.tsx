import { TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { Card, CardActionArea, CardMedia, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import * as React from "react";
import { FC, FunctionComponent, useState } from "react";
import { AsyncProps, useAsync } from "react-async";

import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

enum TimelineElementPosition {
    First="first",
    Last="last",
    Middle="middle"
};

interface IProps {
    position: string;
    company_id: string;
    company_name: string;
    start_date: string;
    end_date?: string;
    link?: string;
    doticon?: string;
}

function dotIcon(icon_name: string | undefined) {
    if(icon_name) {
        if(icon_name == "school") {
            return <SchoolIcon/>
        } else if(icon_name == "work") {
            return <WorkIcon/>
        } else if(icon_name == "simpledot") {
            return;
        } else {
            return <WorkIcon/>
        }
    } else {
        return <WorkIcon/>
    }
}

function parse_date(json_date: string | undefined): string {
    if(json_date) {
        const months_en = {
            1: "January",
            2: "February",
            3: "March",
            4: "April",
            5: "May",
            6: "June",
            7: "July",
            8: "August",
            9: "September",
            10: "October",
            11: "November",
            12: "December",
        };
        if (json_date.split(".").length == 2)
        {
            const [month, year] = json_date.split(".");
            return months_en[parseInt(month)] + " " + year;
        } else {
            return json_date
        }
    } else {
        return "now";
    }
}

const ExperienceElement: FunctionComponent<IProps> = (props: IProps) => {
    const [get_job_desc, set_job_desc] = useState<string>("");
    fetch("static_data/experience/" + props.company_id + "/en.html").then((value: Response) => {
        value.text().then((value: string) => {
            set_job_desc(value);
        })
    });
    return (
        <TimelineItem>
        <TimelineOppositeContent sx={{ maxWidth: "25%" }} color="text.secondary">
            {parse_date(props.start_date) + " - " + parse_date(props.end_date)}
        </TimelineOppositeContent>
        <TimelineSeparator>
            <TimelineDot color={("now" == parse_date(props.end_date))?"primary":"grey"}>
                {dotIcon(props.doticon)}
            </TimelineDot>
            {(props.position != TimelineElementPosition.Last) && <TimelineConnector />}
        </TimelineSeparator>
        <TimelineContent>
            <Card elevation={3} sx={{bgcolor: "paper", padding: 2}}>
                <CardActionArea onClick={props.link?()=>{window.location.href=props.link}:()=>{return}}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={"static_data/experience/"+props.company_id+"/logo.png"}
                        sx={{objectFit: "contain"}}
                    />
                </CardActionArea>
            <Typography align={"center"} gutterBottom variant="h5" component="div">{props.company_name}</Typography>
            <div dangerouslySetInnerHTML={{ __html: get_job_desc }}></div>
            </Card>
        </TimelineContent>
        </TimelineItem>
    );
}

const getExperienceContent = async (
    props: AsyncProps<string>,
    controller: AbortController
): Promise<string> => {
    const response = await fetch("static_data/experience/contents.json");
    return response.text();
};

interface IExpProps {
    type: string;
};

const ExperienceByType: FunctionComponent<IExpProps> = (props: IExpProps) => {
    const job_elements: Array<React.FunctionComponentElement<IProps>> = [];
    const jobs_txt = useAsync({ promiseFn: getExperienceContent }).value

    if( typeof jobs_txt == "string" ) {
        let jobs: Array<any> = JSON.parse(jobs_txt)["entries"];

        if(props.type != "all") {
            jobs = jobs.filter((val: any)=> { return props.type == val["type"] });
        }

        for(let i = 0; i < jobs.length; i++) {
            let pos = TimelineElementPosition.Middle;
            if (i == 0) pos = TimelineElementPosition.First;
            else if (i == (jobs.length - 1)) pos = TimelineElementPosition.Last;
            const elem = React.createElement(ExperienceElement,
                {
                    position: pos,
                    company_id: jobs[i]["id"],
                    company_name: jobs[i]["name"],
                    start_date: jobs[i]["start_date"],
                    end_date: jobs[i]["end_date"],
                    link: jobs[i]["link"],
                    doticon: (props.type == "all")?jobs[i]["type"]:"simpledot",
                });
                job_elements.push(elem);
        }
    }

    return React.createElement("Timeline", {postion: "right", sx: {positionLeft: "left"}}, job_elements);
}



export const Experience: FC = () => {
    const [merged, setMerged] = React.useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMerged(event.target.checked);
    };

    let history_elements: Array<JSX.Element>;
    const switch_element: JSX.Element = 
        (<FormControlLabel
            control={
                <Switch
                    checked={merged}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            }
            label="Merge employment and education histories"
        />);
    if (merged == false) {
        history_elements = [
            (<Typography variant='h4'>Employment</Typography>),
            (<ExperienceByType type="work"/>),
            (<Typography variant='h4'>Education</Typography>),
            (<ExperienceByType type="school"/>)
        ];
    } else {
        history_elements = [
            (<ExperienceByType type="all"/>)
        ];
    }
    history_elements.push(switch_element);
    return React.createElement(Stack,
        { direction: "column", justifyContent: "center", alignItems: "center", spacing: 2},
        history_elements);
}