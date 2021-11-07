import { Box, Button, IconButton } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ScoreLevelFormSchema from './validations';
import useStyles from './styles';
import api from '../../../services/api';
import { useHeaderTitle } from '../../../contexts/headerTitle';
import ScoreLevelInfo from '../Forms/ScoreLevelInfo';
import { IScoreLevelEditForm } from '../../../interfaces/IScoreLevel';
import { INITIAL_FORM_VALUES } from '../../../constants/scoreLevel';

function Register() {
  const classes = useStyles();

  const history = useHistory();
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Cadastro de Nível de Pontuação');
  }, []);

  const handleOnSubmit = useCallback(async (values: IScoreLevelEditForm, actions) => {
    const benefitPayload = {
      name: values.score_level_name,
      pointsThreshold: values.score_level_pointsThreshold,
      benefits: values.score_level_benefits.map(benefit => benefit._id)
    };

    try {
      await api.post('/score-level', benefitPayload);

      actions.setSubmitting(false);
      toast.success('Nível criado com sucesso!');
      history.push('/score-level');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na criação do nível: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na criação do nível`);
        actions.setSubmitting(false);
      }
    }
  }, []);

  return (
    <>
      <div className={classes.tabs}>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
      </div>
      <div className={classes.content}>
        <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={ScoreLevelFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IScoreLevelEditForm>) => (
            <Form>
              <div className={classes.formContainer}>
                <ScoreLevelInfo />
              </div>

              <div className={classes.footerButtons}>
                <Button
                  className={classes.saveButton}
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
          )}
        </Formik>
      </div>
    </>
  );
}

export default Register;
