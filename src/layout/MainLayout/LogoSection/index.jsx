import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

// project imports
import config from 'config';
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO / TITLE ||============================== //

const LogoSection = () => {
    const defaultId = useSelector((state) => state.customization.defaultId);
    const dispatch = useDispatch();
    return (
        <ButtonBase
            disableRipple
            onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
            component={Link}
            to={config.defaultPath}
            sx={{ mt: 1 }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    color: '#ffffff',
                    letterSpacing: 0.5
                }}
            >
                Delivery App
            </Typography>
        </ButtonBase>
    );
};

export default LogoSection;
