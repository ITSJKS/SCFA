# Your code here
n=int(input())
mat=[]
for i in range(n):
    mat.append(list(map(int,input().split())))

primary=[]
secondary=[]

for i in range(n):
    for j in range(n):
        if i==j:
            primary.append(mat[i][j])
        if i+j==n-1:
            secondary.append(mat[i][j])

p=len(primary)
s=len(secondary)
result1 = True
result2 = True

for i in range(p):
    for j in range(i,p):
        if primary[i] != primary[j]:
            result1 = False
            break
for i in range(s):
    for j in range(i,s):
        if secondary[i] != secondary[j]:
            result2 = False
            break



if result1 and result2:
    print("Double Harmony")
else:
    print("No Harmony")