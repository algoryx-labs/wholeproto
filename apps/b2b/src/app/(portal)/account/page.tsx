"use client";

import { formatDate } from "@westwinds/lib";
import {
  Badge,
  Input,
  Label,
  Money,
  PageHeader,
  SectionCard,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@westwinds/ui";
import { useLakeshoreAccount } from "@/hooks/use-lakeshore-account";
import { useLakeshoreBilling } from "@/hooks/use-lakeshore-billing";
import { useSessionStore } from "@/stores/session-store";

export default function AccountPage() {
  const { customer, priceGroup } = useLakeshoreAccount();
  const user = useSessionStore((s) => s.user);
  const role = useSessionStore((s) => s.role);
  const { credit } = useLakeshoreBilling();
  const { available, usedPct, used } = credit;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account"
        description={`${customer.name} · ${customer.accountNumber}`}
      />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-4">
          <SectionCard title="Buyer profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input readOnly value={user?.name ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input readOnly value={user?.email ?? ""} />
              </div>
              <div className="space-y-2">
                <Label>Demo role</Label>
                <Input readOnly value={role} />
              </div>
              <div className="space-y-2">
                <Label>HST number</Label>
                <Input readOnly value={customer.hstNumber} />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="locations" className="mt-4">
          <SectionCard title="Delivery locations">
            <ul className="divide-y divide-[var(--border)]">
              {customer.locations.map((loc) => (
                <li
                  key={loc.id}
                  className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {loc.label}
                      {loc.isDefault ? (
                        <Badge className="ml-2" variant="soft">
                          Default
                        </Badge>
                      ) : null}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {loc.line1}, {loc.city} {loc.province} {loc.postalCode}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <SectionCard title="Team members">
            <ul className="divide-y divide-[var(--border)]">
              {customer.users.map((member) => (
                <li
                  key={member.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {member.email}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <Badge variant="secondary">
                      {member.role.replace(/_/g, " ")}
                    </Badge>
                    {member.lastLoginAt ? (
                      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                        Last login {formatDate(member.lastLoginAt)}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="credit" className="mt-4">
          <SectionCard
            title="Credit & pricing"
            description={`${priceGroup?.name ?? "Standard"} price group · ${customer.terms}`}
          >
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Limit</dt>
                <dd>
                  <Money amount={customer.creditLimit} className="text-lg font-semibold" />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Balance used</dt>
                <dd>
                  <Money amount={used} className="text-lg font-semibold" />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--muted-foreground)]">Available</dt>
                <dd>
                  <Money
                    amount={available}
                    className="text-lg font-semibold text-[var(--primary)]"
                  />
                </dd>
              </div>
            </dl>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
              <div
                className="h-full rounded-full bg-[var(--primary)]"
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Buyer approval limit in this demo: $5,000. Switch role from the
              account menu to Approver to place larger orders without approval.
            </p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <SectionCard title="Notification preferences">
            <ul className="space-y-4">
              {[
                {
                  id: "ship",
                  label: "Shipment updates",
                  desc: "Email when orders ship from Mississauga or Brampton",
                  on: true,
                },
                {
                  id: "invoice",
                  label: "New invoices",
                  desc: "Notify when Net 30 invoices are issued",
                  on: true,
                },
                {
                  id: "promo",
                  label: "Trade promotions",
                  desc: "Case deals and volume offers for your price group",
                  on: false,
                },
                {
                  id: "low",
                  label: "Low credit alerts",
                  desc: "Warn when available credit drops below 20%",
                  on: true,
                },
              ].map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {item.desc}
                    </p>
                  </div>
                  <Switch defaultChecked={item.on} aria-label={item.label} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
