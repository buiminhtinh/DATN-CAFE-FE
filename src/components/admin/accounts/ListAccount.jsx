
import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccountList from './AccountList';
import AccountForm from './AccountForm';
import {
  getAccounts,
  updateAccountActive,
  insertAccount,
  findAccountByNameContainsIgnoreCase,
  updateAccount,
  getAccount,
  findAccountByPhoneContainsIgnoreCase,
} from '../../../redux/actions/accountAction';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
} from 'antd';
import ContentHeader from '../common/ContentHeader';
import withRouter from '../../../helpers/withRouter';

export class ListAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: { username: "", fullName: "", phone: "", active: true, image: "" },
      open: false,
      query: "",
    };

    this.timeout = null;
  }

  componentDidMount = () => {
    this.props.getAccounts();
    console.log('Component Mounted: Fetching accounts');
  };

  editAccount = (value) => {
    this.setState({ account: value, open: true });
    console.log(value);
  };

  onSubmitForm = (values) => {
    const { account } = this.state;

    if (account.username) {
      console.log(account.username)
      this.props.updateAccount(account.username, values);
    } else {
      this.props.insertAccount(values);
    }

    this.setState({ open: false });
  };

  handleSearch = (value) => {
    const query = value.target.value;
    this.setState({ query });

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (query) {
        this.props.findAccountByNameContainsIgnoreCase(query);
        this.props.findAccountByPhoneContainsIgnoreCase(query);
      } else {
        this.props.getAccounts();
      }
    }, 1500);
  };

  openModal = () => {
    this.setState({ account: {}, open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { accounts, getAccounts, isLoading, router } = this.props;
    const { open, query } = this.state;
    const { navigate } = this.props.router;
    if (isLoading) {
      return (
        <>
          <ContentHeader
            navigate={navigate}
            title="Danh sách tài khoản"
            className="site-page-header"
          ></ContentHeader>
          <Skeleton active />
        </>
      );
    }
    return (
      <>
        <ContentHeader
          navigate={navigate}
          title="Danh sách tài khoản"
          className="site-page-header"
        />

        <Row style={{ marginBottom: 10 }}>
          <Col md={18}>
            <Form layout="inline" name="searchForm" initialValues={{ query }}>
              <Form.Item name="query">
                <Input
                  placeholder="Tìm tài khoản "
                  value={query}
                  onChange={this.handleSearch}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col md={6} style={{ textAlign: 'right', paddingRight: 5 }}>
            <Button type="primary" onClick={() => this.setState({ account: {}, open: true })}>
              Thêm mới tài khoản
            </Button>
          </Col>
        </Row>

        <AccountList
          editAccount={this.editAccount}
          accounts={accounts}
          getAccounts={getAccounts}
          router={router}
          updateAccountActive={this.props.updateAccountActive}
        />

        <AccountForm
          router={router}
          isLoading={isLoading}
          open={open}
          accounts={accounts}
          account={this.state.account}
          onSubmitForm={this.onSubmitForm}
          onCancel={() => {
            this.setState({ ...this.state, open: false })
          }}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  accounts: state.accountReducer.accounts,
  account: state.accountReducer.account,
  isLoading: state.accountReducer.isLoading,
});

const mapDispatchToProps = {
  getAccounts,
  getAccount,
  updateAccount,
  updateAccountActive,
  findAccountByNameContainsIgnoreCase,
  insertAccount,
  findAccountByPhoneContainsIgnoreCase,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListAccount));
