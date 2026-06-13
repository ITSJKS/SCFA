S = input()
arr = ["a", "e", "i", "o", "u"]
count = 0

for i in range(len(S)):
    if S[i] in arr:
        count += 0
    else:
        count += 1

print(count)