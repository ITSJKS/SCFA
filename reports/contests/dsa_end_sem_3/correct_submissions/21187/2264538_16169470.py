n = int(input())

matrix = []

for i in range(n):
    matrix.append(list(map(int, input().split())))

diagnoal_principal = []
diagonal_other = []

for i in range(n):
    for j in range(n):
        if i == j:
            diagnoal_principal.append(matrix[i][j])
        if i + j + 1 == n:
            diagonal_other.append(matrix[i][j])

if len(set(diagnoal_principal)) == 1 and len(set(diagonal_other)) == 1:
    print("Double Harmony")
else:
    print("No Harmony")