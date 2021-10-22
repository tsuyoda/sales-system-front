import { Accordion, AccordionDetails, AccordionSummary, Button, Typography, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { ChangeEvent, useCallback } from 'react';
import { Form, FieldArray, Field, useFormikContext } from 'formik';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import { IResource, IRoleEditForm } from '../../../../interfaces/IRole';
import CheckboxFormField from '../../../Shared/FormFields/CheckboxFormField';
import { useStyles } from './styles';
import TextFormField from '../../../Shared/FormFields/TextFormField';

interface RoleFormProps {
  resources: IResource[];
}

function RoleForm({ resources }: RoleFormProps) {
  const classes = useStyles();
  const history = useHistory();

  const { values, setFieldValue, setFieldTouched, isValid, isSubmitting, touched, errors } =
    useFormikContext<IRoleEditForm>();

  const getLabelByAction = (action: string) => {
    const actionDict: { [key: string]: string } = {
      create: 'CRIAR',
      read: 'VISUALIZAR',
      update: 'EDITAR',
      delete: 'DELETAR'
    };

    return actionDict[action] || action;
  };

  const handleChangeCheck = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched(name, true);
    setFieldValue(name, event.target.checked);
  };

  const handleChangeName = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('role_name', true);
    setFieldValue('role_name', event.target.value);
  }, []);

  return (
    <Form>
      <div className={classes.header}>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <div className={classes.nameContainer}>
          <Field
            className={classes.name}
            inputProps={{ maxLength: 30 }}
            name='role_name'
            component={TextFormField}
            label='Nome'
            variant='outlined'
            onChange={handleChangeName}
            value={values.role_name}
            error={touched.role_name && !!errors.role_name}
            helperText={touched.role_name && errors.role_name}
          />
        </div>
      </div>
      <FieldArray name='resources'>
        {() =>
          resources.map((resource, resourceIndex) => (
            <Accordion key={resource.name}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.title}>{resource.translatedName}</Typography>
              </AccordionSummary>

              <AccordionDetails className={classes.details}>
                <FieldArray name={`resources[${resourceIndex}].actions`}>
                  {() =>
                    resource.availableActions.map((action, actionIndex) => (
                      <Field
                        key={action}
                        name={`resources[${resourceIndex}].actions[${actionIndex}]`}
                        component={CheckboxFormField}
                        label={getLabelByAction(action)}
                        onChange={handleChangeCheck(`resources[${resourceIndex}].actions[${actionIndex}]`)}
                        checked={values.resources[resourceIndex]?.actions[actionIndex] || false}
                      />
                    ))
                  }
                </FieldArray>
              </AccordionDetails>
            </Accordion>
          ))
        }
      </FieldArray>
      <div className={classes.footerButtons}>
        <Button
          color='secondary'
          variant='contained'
          type='submit'
          disabled={!isValid || isSubmitting}
          startIcon={<SaveIcon />}
        >
          Salvar
        </Button>
      </div>
    </Form>
  );
}

export default RoleForm;
