# Your code here
n = int(input())
maxtrix = []
for i in range(n):
    lst = list(map(int,input().split()))
    maxtrix.append(lst)
m1 = []
for i in range(n):
    for j in range(n):
        if i==j:
            m1.append(maxtrix[i][j])
m2 = []
for i in range(n):
    for j in range(n):
        if i+j==n-1:
            m2.append(maxtrix[i][j])
c1 = True
c2 = True
for i in range(len(m1)-1):
    if m1[i]!=m1[i+1]:
        c1=False
    if m2[i]!=m2[i+1]:
        c2 = False

if c1 and c2:
    print("Double Harmony")
else:
    print("No Harmony")