# users/actions.py
class Action:
    # --- Auth / Seguridad de sesión ---
    AUTH_REGISTER_REQUESTED      = "auth.register_requested"
    AUTH_USER_APPROVED           = "auth.user_approved"
    AUTH_USER_REJECTED           = "auth.user_rejected"
    AUTH_LOGIN                   = "auth.login"
    AUTH_LOGIN_FAILED            = "auth.login_failed"
    AUTH_LOGOUT                  = "auth.logout"
    AUTH_TOKEN_REFRESHED         = "auth.token_refreshed"
    AUTH_PASSWORD_CHANGE         = "auth.password_change"
    AUTH_PASSWORD_RESET_REQUEST  = "auth.password_reset_requested"
    AUTH_PASSWORD_RESET_DONE     = "auth.password_reset_done"
    AUTH_EMAIL_VERIFIED          = "auth.email_verified"

    # --- Perfil / ciclo de vida del usuario ---
    PROFILE_UPDATED              = "profile.updated"
    PROFILE_SOFT_DELETED         = "profile.soft_deleted"
    PROFILE_RESTORED             = "profile.restored"

    # --- Administración ---
    ADMIN_USER_ENABLED           = "admin.user_enabled"
    ADMIN_USER_DISABLED          = "admin.user_disabled"
    ADMIN_ROLE_CHANGED           = "admin.role_changed"
    ADMIN_STOCK_CREATED          = "admin.stock_created"
    ADMIN_STOCK_UPDATED          = "admin.stock_updated"
    ADMIN_STOCK_DELETED          = "admin.stock_deleted"

    # --- Búsquedas / vistas ---
    SEARCH_BY_NAME               = "search.by_name"
    SEARCH_BY_CATEGORY           = "search.by_category"
    SEARCH_BY_FILTER             = "search.by_filter"
    STOCK_VIEWED                 = "stock.viewed"
    PORTFOLIO_VIEWED             = "portfolio.viewed"
    TRANSACTIONS_VIEWED          = "transactions.viewed"

    # --- Trading / órdenes ---
    TRADING_BUY_SUBMITTED        = "trading.buy_submitted"
    TRADING_BUY_EXECUTED         = "trading.buy_executed"
    TRADING_BUY_CANCELLED        = "trading.buy_cancelled"
    TRADING_SELL_SUBMITTED       = "trading.sell_submitted"
    TRADING_SELL_EXECUTED        = "trading.sell_executed"
    TRADING_SELL_CANCELLED       = "trading.sell_cancelled"

    # --- Fondos / simulación banco ---
    FUNDS_DEPOSIT_REQUESTED      = "funds.deposit_requested"
    FUNDS_DEPOSIT_CONFIRMED      = "funds.deposit_confirmed"
    FUNDS_WITHDRAWAL_REQUESTED   = "funds.withdrawal_requested"
    FUNDS_WITHDRAWAL_CONFIRMED   = "funds.withdrawal_confirmed"
    FUNDS_FEE_CHARGED            = "funds.fee_charged"

    # --- Reportes / correos ---
    REPORTS_REQUESTED            = "reports.requested"
    REPORTS_GENERATED            = "reports.generated"
    REPORTS_EMAIL_SENT           = "reports.email_sent"
    EMAIL_MOVEMENT_SENT          = "email.movement_sent"

    # --- Referidos ---
    REFERRAL_CODE_APPLIED        = "referral.code_applied"
    REFERRAL_REWARD_GRANTED      = "referral.reward_granted"