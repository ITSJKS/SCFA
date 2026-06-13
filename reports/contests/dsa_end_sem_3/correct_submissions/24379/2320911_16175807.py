n = int(input())
a = list(map(int, input().split()))

st = []
for i in a:
    if not st:
        st.append(i)
    else:
        if st[-1] + i == 0:
            st.pop()
        else:
            if st[-1] > 0:
                if i > 0:
                    st.append(i)
                else:
                    if abs(i) > abs(st[-1]):
                        while len(st) != 0 and abs(i) > abs(st[-1]) and st[-1] > 0:
                            st.pop()
                        st.append(i)
            else:
                if i < 0:
                    st.append(i)
                else:
                    if abs(i) > abs(st[-1]):
                        while len(st) != 0 and abs(i) > abs(st[-1]) and st[-1] < 0:
                            st.pop()
                        st.append(i)

print(*st)