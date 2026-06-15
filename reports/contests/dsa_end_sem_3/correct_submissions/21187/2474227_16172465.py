n = int(input())
nst = []
for _ in range(n):
    row = list(map(int,input().split()))
    nst.append(row)
pri = []
src = []
for i in range(len(nst)):
    for j in range(len(nst[0])):
        if i ==j:
            pri.append(nst[i][j])
        if i+j==n-1:
            src.append(nst[i][j])
ans = True
for i in pri:
    if i !=pri[0]:
        ans = False
for j in src:
    if j!= src[0]:
        ans = False
if ans:
    print("Double Harmony")
else:
    print("No Harmony")