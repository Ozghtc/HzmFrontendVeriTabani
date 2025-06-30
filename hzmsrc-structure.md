# HZM Frontend - src/ Klasör Yapısı ve Dosya Detayları

## 📊 Özet İstatistikler
- **Toplam Dosya Sayısı**: ~230+ dosya
- **Refactor Edilen**: 16 dosya (fieldReducer.ts dahil)
- **300+ Satır**: 2 dosya kaldı
- **Toplam Satır**: ~17,000+

## 🗂️ Detaylı Klasör Yapısı

```
src/
├── 📱 App.tsx                                        (122 satır)
├── 🚀 main.tsx                                       (10 satır)
├── 🎨 App.css                                        (43 satır)
├── 🔧 vite-env.d.ts                                  (1 satır)
│
├── 📁 components/
│   ├── 🔒 AdminRoute.tsx                             (23 satır)
│   ├── 🔐 ProtectedRoute.tsx                        (19 satır)
│   ├── 🏗️ Layout.tsx                                (16 satır)
│   ├── 🔑 ApiKeyDisplay.tsx                         (85 satır) ✅ REFACTORED
│   │
│   ├── 📁 api-key-display/                          [ApiKeyDisplay refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── AddApiKeyModal.tsx                   (124 satır)
│   │   │   ├── ApiExamples.tsx                      (95 satır)
│   │   │   ├── ApiKeyHeader.tsx                     (36 satır)
│   │   │   ├── MainApiKey.tsx                       (71 satır)
│   │   │   ├── 📁 AdditionalApiKeys/
│   │   │   │   ├── index.tsx                        (57 satır)
│   │   │   │   └── ApiKeyCard.tsx                   (89 satır)
│   │   │   └── 📁 shared/
│   │   │       ├── ApiKeyMask.tsx                   (24 satır)
│   │   │       ├── EmptyState.tsx                   (28 satır)
│   │   │       └── PermissionBadge.tsx              (29 satır)
│   │   ├── 📁 hooks/
│   │   │   └── useApiKeyManager.ts                  (98 satır)
│   │   ├── 📁 types/
│   │   │   └── apiKeyTypes.ts                       (29 satır)
│   │   ├── 📁 utils/
│   │   │   └── apiKeyHelpers.ts                     (38 satır)
│   │   └── 📁 constants/
│   │       └── apiKeyConstants.ts                   (14 satır)
│   │
│   └── 📁 panels/
│       ├── 📊 ProjectPanel.tsx                       (60 satır)
│       ├── 📊 TablePanel.tsx                         (102 satır) ✅ REFACTORED
│       ├── 📊 FieldPanel.tsx                         (246 satır) ✅ REFACTORED
│       │
│       ├── 📁 table/                                 [TablePanel refactor klasörü]
│       │   ├── 📁 components/
│       │   │   ├── AddTableForm.tsx                  (99 satır)
│       │   │   ├── DeleteTableModal.tsx              (64 satır)
│       │   │   ├── TableList.tsx                     (47 satır)
│       │   │   └── TableListItem.tsx                 (94 satır)
│       │   ├── 📁 hooks/
│       │   │   └── useTableApi.ts                    (130 satır)
│       │   ├── 📁 types/
│       │   │   └── tableTypes.ts                     (26 satır)
│       │   └── 📁 utils/
│       │       └── tableValidation.ts                (19 satır)
│       │
│       └── 📁 field/                                 [FieldPanel refactor klasörü]
│           ├── FieldPanel.tsx                        (246 satır) ✅
│           ├── 📁 components/
│           │   ├── SortableFieldRow.tsx              (240 satır)
│           │   ├── FieldForm.tsx                     (140 satır)
│           │   ├── FieldValidationInputs.tsx         (229 satır)
│           │   ├── RelationshipModal.tsx             (174 satır)
│           │   └── 📁 FieldEditModal/
│           │       ├── index.tsx                     (144 satır)
│           │       ├── BasicTab.tsx                  (98 satır)
│           │       ├── ValidationTab.tsx             (86 satır)
│           │       └── RelationshipsTab.tsx          (72 satır)
│           ├── 📁 constants/
│           │   └── fieldConstants.ts                 (45 satır)
│           └── 📁 utils/
│               └── validationRenderer.tsx            (29 satır)
│
├── 📁 context/
│   ├── 🧠 DatabaseContext.tsx                        (28 satır) ✅ REFACTORED
│   │
│   ├── 📁 constants/
│   │   ├── defaultData.ts                            (150 satır)
│   │   └── storageKeys.ts                            (15 satır)
│   ├── 📁 hooks/
│   │   ├── useAuth.ts                                (153 satır)
│   │   └── useDatabase.ts                            (6 satır)
│   ├── 📁 reducers/
│   │   ├── authReducer.ts                            (49 satır)
│   │   ├── databaseReducer.ts                        (66 satır)
│   │   ├── fieldReducer.ts                           (166 satır) ✅ REFACTORED (464'den düşürüldü)
│   │   ├── pricingReducer.ts                         (100 satır)
│   │   ├── projectReducer.ts                         (212 satır)
│   │   ├── tableReducer.ts                           (150 satır)
│   │   ├── userReducer.ts                            (93 satır)
│   │   └── 📁 field/                                 [fieldReducer refactor klasörü]
│   │       └── 📁 utils/
│   │           └── updateHelpers.ts                  (78 satır) 🆕 Helper fonksiyonlar
│   ├── 📁 types/
│   │   └── contextTypes.ts                           (89 satır)
│   └── 📁 utils/
│       ├── helpers.ts                                (45 satır)
│       └── storage.ts                                (29 satır)
│
├── 📁 hooks/
│   ├── 🪝 useApiAdmin.ts                             (312 satır) 🟡 320 limit altında
│   └── 🪝 useApiProjects.ts                          (169 satır)
│
├── 📁 pages/
│   ├── 👑 AdminPage.tsx                              (31 satır) ✅ REFACTORED
│   ├── 🔌 ApiProjects.tsx                            (75 satır) ✅ REFACTORED
│   ├── 🧪 ApiTest.tsx                                (108 satır)
│   ├── 🏠 DashboardPage.tsx                          (237 satır)
│   ├── 💰 DatabasePricing.tsx                        (215 satır) ✅ REFACTORED
│   ├── 📁 DatabaseProjects.tsx                       (102 satır) ✅ REFACTORED
│   ├── 📊 DatabaseState.tsx                          (69 satır) ✅ REFACTORED
│   ├── 👥 DatabaseUsers.tsx                          (129 satır) ✅ REFACTORED
│   ├── 🏡 HomePage.tsx                               (164 satır)
│   ├── 📦 LocalStorageMigration.tsx                  (272 satır)
│   ├── 🔐 LoginPage.tsx                              (151 satır)
│   ├── 📝 RegisterPage.tsx                           (207 satır)
│   ├── 📊 ProjectDataView.tsx                        (100 satır) ✅ REFACTORED
│   ├── 📋 ProjectList.tsx                            (103 satır) ✅ REFACTORED
│   ├── ⚙️ ProjectManagement.tsx                      (81 satır) ✅ REFACTORED
│   ├── ⬆️ UpgradePlanPage.tsx                        (92 satır) ✅ REFACTORED
│   │
│   ├── 📁 admin/                                     [AdminPage refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── AdminGuard.tsx                        (23 satır)
│   │   │   ├── AdminHeader.tsx                       (36 satır)
│   │   │   ├── AdminLoading.tsx                      (17 satır)
│   │   │   ├── DatabaseManagementCards.tsx           (73 satır)
│   │   │   ├── QuickActions.tsx                      (45 satır)
│   │   │   └── StatsCards.tsx                        (68 satır)
│   │   ├── 📁 constants/
│   │   │   └── adminConstants.tsx                    (126 satır)
│   │   ├── 📁 hooks/
│   │   │   └── useAdminData.ts                       (45 satır)
│   │   └── 📁 types/
│   │       └── adminTypes.ts                         (23 satır)
│   │
│   ├── 📁 ApiProjects/                               [ApiProjects refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── AuthGuard.tsx                         (34 satır)
│   │   │   ├── DeleteConfirmationModal.tsx           (66 satır)
│   │   │   ├── EmptyState.tsx                        (21 satır)
│   │   │   ├── ErrorDisplay.tsx                      (21 satır)
│   │   │   ├── LoadingIndicator.tsx                  (21 satır)
│   │   │   ├── ProjectCard.tsx                       (79 satır)
│   │   │   ├── ProjectCreationForm.tsx               (81 satır)
│   │   │   ├── ProjectsHeader.tsx                    (39 satır)
│   │   │   └── ProjectsList.tsx                      (35 satır)
│   │   ├── 📁 hooks/
│   │   │   └── useApiProjectsPage.ts                 (109 satır)
│   │   ├── 📁 types/
│   │   │   └── index.ts                              (17 satır)
│   │   └── 📁 utils/
│   │       └── helpers.ts                            (12 satır)
│   │
│   ├── 📁 pricing/                                   [DatabasePricing refactor klasörü]
│   │   ├── DatabasePricing.tsx                       (215 satır) ✅
│   │   ├── 📁 components/
│   │   │   ├── CampaignCard.tsx                      (151 satır)
│   │   │   ├── PlanCard.tsx                          (122 satır)
│   │   │   ├── PricingHeader.tsx                     (55 satır)
│   │   │   ├── StatsCards.tsx                        (89 satır)
│   │   │   ├── 📁 modals/
│   │   │   │   ├── CampaignFormModal.tsx             (322 satır) ⚠️ 320+ satır
│   │   │   │   └── PlanFormModal.tsx                 (236 satır)
│   │   │   └── 📁 tabs/
│   │   │       ├── CampaignsTab.tsx                  (86 satır)
│   │   │       └── PlansTab.tsx                      (72 satır)
│   │   ├── 📁 constants/
│   │   │   └── pricingConstants.ts                   (42 satır)
│   │   └── 📁 utils/
│   │       ├── campaignHelpers.tsx                   (68 satır)
│   │       └── pricingHelpers.tsx                    (95 satır)
│   │
│   ├── 📁 database-projects/                         [DatabaseProjects refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── DeleteProjectModal.tsx                (68 satır)
│   │   │   ├── ProjectCard.tsx                       (141 satır)
│   │   │   ├── ProjectsFilters.tsx                   (73 satır)
│   │   │   ├── ProjectsHeader.tsx                    (42 satır)
│   │   │   ├── ProjectsLoading.tsx                   (29 satır)
│   │   │   ├── ProjectsNotification.tsx              (35 satır)
│   │   │   └── ProjectsStats.tsx                     (56 satır)
│   │   ├── 📁 constants/
│   │   │   └── projectConstants.ts                   (28 satır)
│   │   ├── 📁 hooks/
│   │   │   └── useProjectsManagement.ts              (123 satır)
│   │   ├── 📁 types/
│   │   │   └── projectTypes.ts                       (31 satır)
│   │   └── 📁 utils/
│   │       └── projectHelpers.ts                     (42 satır)
│   │
│   ├── 📁 database-state/                            [DatabaseState refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── ClearDataModal.tsx                    (89 satır)
│   │   │   ├── DangerZone.tsx                        (52 satır)
│   │   │   ├── DatabaseStateHeader.tsx               (34 satır)
│   │   │   ├── DetailedStats.tsx                     (98 satır)
│   │   │   ├── StorageStats.tsx                      (76 satır)
│   │   │   ├── 📁 DataManagement/
│   │   │   │   ├── index.tsx                         (45 satır)
│   │   │   │   ├── ExportSection.tsx                 (67 satır)
│   │   │   │   └── ImportSection.tsx                 (73 satır)
│   │   │   └── 📁 shared/
│   │   │       └── StatusIcon.tsx                    (19 satır)
│   │   ├── 📁 constants/
│   │   │   └── databaseStateConstants.ts             (38 satır)
│   │   ├── 📁 hooks/
│   │   │   └── useDatabaseState.ts                   (92 satır)
│   │   ├── 📁 types/
│   │   │   └── databaseStateTypes.ts                 (26 satır)
│   │   └── 📁 utils/
│   │       └── storageHelpers.ts                     (54 satır)
│   │
│   ├── 📁 database-users/                            [DatabaseUsers refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── AddUserModal.tsx                      (127 satır)
│   │   │   ├── DeleteUserModal.tsx                   (72 satır)
│   │   │   ├── UsersFilters.tsx                      (89 satır)
│   │   │   ├── UsersHeader.tsx                       (48 satır)
│   │   │   ├── UsersLoading.tsx                      (31 satır)
│   │   │   ├── UsersNotification.tsx                 (42 satır)
│   │   │   ├── UsersStats.tsx                        (67 satır)
│   │   │   ├── UsersTable.tsx                        (95 satır)
│   │   │   └── UserTableRow.tsx                      (176 satır)
│   │   ├── 📁 constants/
│   │   │   └── userConstants.ts                      (45 satır)
│   │   ├── 📁 hooks/
│   │   │   └── useUsersManagement.ts                 (192 satır)
│   │   ├── 📁 types/
│   │   │   └── userTypes.ts                          (38 satır)
│   │   └── 📁 utils/
│   │       ├── userHelpers.ts                        (52 satır)
│   │       └── userStyles.ts                         (29 satır)
│   │
│   ├── 📁 project-data-view/                         [ProjectDataView refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── DeleteRowModal.tsx                    (78 satır)
│   │   │   ├── ProjectHeader.tsx                     (56 satır)
│   │   │   ├── TablesSidebar.tsx                     (89 satır)
│   │   │   ├── 📁 DataTable/
│   │   │   │   ├── index.tsx                         (129 satır)
│   │   │   │   ├── AddRowForm.tsx                    (92 satır)
│   │   │   │   ├── DataTableHeader.tsx               (67 satır)
│   │   │   │   ├── DataTableRow.tsx                  (98 satır)
│   │   │   │   └── TableStats.tsx                    (45 satır)
│   │   │   └── 📁 EmptyStates/
│   │   │       ├── NoDataState.tsx                   (32 satır)
│   │   │       ├── NoFieldsState.tsx                 (28 satır)
│   │   │       ├── NoProjectState.tsx                (34 satır)
│   │   │       └── NoTableSelectedState.tsx          (29 satır)
│   │   ├── 📁 constants/
│   │   │   └── dataViewConstants.ts                  (23 satır)
│   │   ├── 📁 hooks/
│   │   │   └── useProjectDataView.ts                 (141 satır)
│   │   ├── 📁 types/
│   │   │   └── dataViewTypes.ts                      (42 satır)
│   │   └── 📁 utils/
│   │       ├── dataFormatters.ts                     (67 satır)
│   │       ├── dataHandlers.ts                       (89 satır)
│   │       └── inputRenderers.tsx                    (98 satır)
│   │
│   ├── 📁 project-list/                              [ProjectList refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── AddProjectForm.tsx                    (98 satır)
│   │   │   ├── DeleteProjectModal.tsx                (76 satır)
│   │   │   ├── NotificationBanner.tsx                (45 satır)
│   │   │   ├── ProjectListHeader.tsx                 (52 satır)
│   │   │   ├── 📁 ProjectCard/
│   │   │   │   ├── index.tsx                         (89 satır)
│   │   │   │   ├── ApiKeySection.tsx                 (67 satır)
│   │   │   │   ├── ProjectActions.tsx                (45 satır)
│   │   │   │   └── ProjectCardHeader.tsx             (38 satır)
│   │   │   └── 📁 States/
│   │   │       ├── EmptyState.tsx                    (34 satır)
│   │   │       ├── ErrorState.tsx                    (29 satır)
│   │   │       └── LoadingState.tsx                  (26 satır)
│   │   ├── 📁 constants/
│   │   │   └── projectListConstants.ts               (31 satır)
│   │   ├── 📁 hooks/
│   │   │   ├── useNotification.ts                    (42 satır)
│   │   │   └── useProjectList.ts                     (164 satır)
│   │   ├── 📁 types/
│   │   │   └── projectListTypes.ts                   (35 satır)
│   │   └── 📁 utils/
│   │       └── projectValidators.ts                  (28 satır)
│   │
│   ├── 📁 project-management/                        [ProjectManagement refactor klasörü]
│   │   ├── 📁 components/
│   │   │   ├── ApiTabContent.tsx                     (78 satır)
│   │   │   ├── ProjectHeader.tsx                     (62 satır)
│   │   │   ├── ProjectLoading.tsx                    (34 satır)
│   │   │   ├── ProjectNotFound.tsx                   (38 satır)
│   │   │   ├── ProjectTabs.tsx                       (56 satır)
│   │   │   ├── TablesTabContent.tsx                  (45 satır)
│   │   │   └── 📁 settings/
│   │   │       ├── ApiSettingsForm.tsx               (89 satır)
│   │   │       ├── ProjectInfoDisplay.tsx            (67 satır)
│   │   │       ├── ProjectInfoForm.tsx               (98 satır)
│   │   │       └── SettingsTab.tsx                   (73 satır)
│   │   ├── 📁 constants/
│   │   │   └── projectConstants.ts                   (28 satır)
│   │   ├── 📁 hooks/
│   │   │   └── useProjectData.ts                     (104 satır)
│   │   └── 📁 types/
│   │       └── projectTypes.ts                       (32 satır)
│   │
│   └── 📁 upgrade-plan/                              [UpgradePlanPage refactor klasörü]
│       ├── 📁 components/
│       │   ├── BillingCycleToggle.tsx                (44 satır)
│       │   ├── CurrentPlanInfo.tsx                   (56 satır)
│       │   ├── EmptyPlansState.tsx                   (29 satır)
│       │   ├── PlanCard.tsx                          (124 satır)
│       │   ├── PlansGrid.tsx                         (67 satır)
│       │   ├── SecurityNotice.tsx                    (32 satır)
│       │   ├── UpgradeHeader.tsx                     (45 satır)
│       │   └── 📁 PaymentForm/
│       │       ├── index.tsx                         (79 satır)
│       │       ├── BillingAddressSection.tsx         (113 satır)
│       │       ├── CardDetailsSection.tsx            (98 satır)
│       │       └── OrderSummary.tsx                  (67 satır)
│       ├── 📁 constants/
│       │   ├── paymentConstants.ts                   (28 satır)
│       │   └── planConstants.ts                      (55 satır)
│       ├── 📁 hooks/
│       │   └── useUpgradePlan.ts                     (102 satır)
│       ├── 📁 types/
│       │   └── upgradeTypes.ts                       (42 satır)
│       └── 📁 utils/
│           ├── formatters.ts                         (31 satır)
│           ├── priceCalculations.ts                  (91 satır)
│           └── validators.ts                         (45 satır)
│
├── 📁 types/
│   └── 📋 index.ts                                   (205 satır)
│
└── 📁 utils/
    ├── 🌐 api.ts                                     (68 satır) ✅ REFACTORED
    ├── 🔑 apiKeyGenerator.ts                         (220 satır)
    │
    └── 📁 api/                                       [api.ts refactor klasörü]
        ├── 📁 config/
        │   └── apiConfig.ts                          (45 satır)
        ├── 📁 core/
        │   ├── ApiClient.ts                          (214 satır)
        │   └── apiInstance.ts                        (18 satır)
        ├── 📁 endpoints/
        │   ├── apiKeyEndpoints.ts                    (42 satır)
        │   ├── authEndpoints.ts                      (38 satır)
        │   ├── dataEndpoints.ts                      (56 satır)
        │   ├── endpointInterfaces.ts                 (28 satır)
        │   ├── fieldEndpoints.ts                     (48 satır)
        │   ├── healthEndpoints.ts                    (19 satır)
        │   ├── projectEndpoints.ts                   (52 satır)
        │   └── tableEndpoints.ts                     (45 satır)
        ├── 📁 interceptors/
        │   ├── requestInterceptor.ts                 (67 satır)
        │   └── responseInterceptor.ts                (112 satır)
        ├── 📁 types/
        │   ├── apiTypes.ts                           (89 satır)
        │   └── endpointTypes.ts                      (120 satır)
        └── 📁 utils/
            ├── authUtils.ts                          (34 satır)
            ├── connectionUtils.ts                    (56 satır)
            ├── fetchUtils.ts                         (78 satır)
            └── rateLimiter.ts                        (139 satır)
```

## 📊 Durum Özeti

### ✅ Refactor Edilenler (16 dosya)
1. DatabaseContext.tsx: 1,360 → 28 satır
2. FieldPanel.tsx: 1,271 → 246 satır
3. DatabasePricing.tsx: 1,131 → 215 satır
4. TablePanel.tsx: 747 → 102 satır
5. DatabaseUsers.tsx: 747 → 129 satır
6. UpgradePlanPage.tsx: 684 → 92 satır
7. ProjectDataView.tsx: 567 → 100 satır
8. AdminPage.tsx: 537 → 31 satır
9. ProjectManagement.tsx: 507 → 81 satır
10. ProjectList.tsx: 498 → 103 satır
11. ApiKeyDisplay.tsx: 459 → 85 satır
12. DatabaseProjects.tsx: 444 → 102 satır
13. DatabaseState.tsx: 403 → 69 satır
14. api.ts: 370 → 68 satır
15. ApiProjects.tsx: 347 → 75 satır
16. fieldReducer.ts: 464 → 166 satır 🆕

### 🟡 300+ Satır Dosyalar (Kalan)
1. CampaignFormModal.tsx: 322 satır (pages/pricing/components/modals/)
2. useApiAdmin.ts: 312 satır (hooks/) - 320 limit altında

### 📈 Başarı Metrikleri
- **Toplam Refactor**: ~8,800 satır → ~1,640 satır
- **Azaltma Oranı**: %81
- **Oluşturulan Dosya**: ~200+
- **Modülerlik**: Her dosya tek sorumluluk prensibi ile
- **Son Refactoring**: fieldReducer.ts - tekrar eden kodlar kaldırıldı (%64 azalma)