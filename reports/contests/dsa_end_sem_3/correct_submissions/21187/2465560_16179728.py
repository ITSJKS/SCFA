# Your code here
a = int(input())
mat = []
one = []
two = []
for _ in range(a):
    li =  list(map(int, input().split()))
    mat.append(li)
for i in range(a):
    for j in range(a):
        if i==j:
            one.append(mat[i][j])
        if i+j==a-1:
            two.append(mat[i][j])
var = True
for o in range(1,len(one)):
    if one[o]!=one[o-1]:
        var = False
        break
varr = True
for s in range(1,len(two)):
    if two[s]!=two[s-1]:
        varr = False
        break
# print(one,two)
if var and varr:
    print("Double Harmony")
else:
    print("No Harmony")